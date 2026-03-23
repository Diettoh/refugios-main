import { Router } from "express";
import { query } from "../db/client.js";

const router = Router();

router.get("/summary", async (_req, res, next) => {
  try {
    const [sales, expenses, reservations, documentsByType, reservationsBySource] = await Promise.all([
      query("SELECT COALESCE(SUM(amount), 0) AS total_sales FROM sales"),
      query("SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM expenses"),
      query("SELECT COUNT(*)::int AS total_reservations FROM reservations"),
      query(
        `SELECT document_type, COUNT(*)::int AS count, COALESCE(SUM(amount),0) AS total
         FROM documents
         GROUP BY document_type
         ORDER BY document_type`
      ),
      query(
        `SELECT source, COUNT(*)::int AS count, COALESCE(SUM(total_amount),0) AS total
         FROM reservations
         GROUP BY source
         ORDER BY count DESC`
      )
    ]);

    const totalSales = Number(sales.rows[0].total_sales);
    const totalExpenses = Number(expenses.rows[0].total_expenses);

    res.json({
      totals: {
        sales: totalSales,
        expenses: totalExpenses,
        profit: totalSales - totalExpenses,
        reservations: reservations.rows[0].total_reservations
      },
      documents: documentsByType.rows,
      reservationSources: reservationsBySource.rows
    });
  } catch (error) {
    next(error);
  }
});

/** GET /api/dashboard/analytics — ventas/gastos por mes, ocupación, alertas */
router.get("/analytics", async (req, res, next) => {
  try {
    const from = req.query.from || "2024-01-01";
    const to = req.query.to || new Date().toISOString().slice(0, 10);
    const params = [from, to];

    const [salesByMonth, expensesByMonth, occupancyByMonth, totals, cabinCount, upcomingTurnover] =
      await Promise.all([
        query(
          `SELECT to_char(s.sale_date, 'YYYY-MM') AS month, COALESCE(SUM(s.amount), 0) AS total
           FROM sales s WHERE s.sale_date >= $1 AND s.sale_date <= $2
           GROUP BY to_char(s.sale_date, 'YYYY-MM')
           ORDER BY month`,
          params
        ),
        query(
          `SELECT to_char(e.expense_date, 'YYYY-MM') AS month, COALESCE(SUM(e.amount), 0) AS total
           FROM expenses e WHERE e.expense_date >= $1 AND e.expense_date <= $2
           GROUP BY to_char(e.expense_date, 'YYYY-MM')
           ORDER BY month`,
          params
        ),
        query(
          `WITH months AS (
             SELECT date_trunc('month', d)::date AS m
             FROM generate_series($1::date, $2::date, interval '1 month') AS d
           )
           SELECT to_char(m.m, 'YYYY-MM') AS month,
                  COALESCE(SUM(
                    CASE WHEN r.id IS NOT NULL
                      THEN GREATEST(0, LEAST(r.check_out, (m.m + interval '1 month' - interval '1 day')::date) - GREATEST(r.check_in, m.m))
                      ELSE 0
                    END
                  ), 0)::int AS noches_totales
           FROM months m
           LEFT JOIN reservations r ON r.check_in < m.m + interval '1 month' AND r.check_out >= m.m AND r.status != 'cancelled'
           GROUP BY m.m
           ORDER BY month`,
          params
        ),
        query(
          `SELECT
             COALESCE((SELECT SUM(amount) FROM sales WHERE sale_date >= $1 AND sale_date <= $2), 0) AS total_sales,
             COALESCE((SELECT SUM(amount) FROM expenses WHERE expense_date >= $1 AND expense_date <= $2), 0) AS total_expenses
           `,
          params
        ),
        query("SELECT COUNT(*)::int AS n FROM cabins"),
        query(
          `SELECT
             r.id,
             g.full_name AS guest_name,
             r.check_in,
             r.check_out,
             r.guests_count,
             c.name AS cabin_name
           FROM reservations r
           JOIN guests g ON g.id = r.guest_id
           LEFT JOIN cabins c ON c.id = r.cabin_id
           WHERE r.status IN ('pending', 'confirmed')
             AND r.check_out BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
           ORDER BY r.check_out, r.id`
        )
      ]);

    const cabinsTotal = Number(cabinCount.rows[0]?.n || 0) || 1;
    const salesData = salesByMonth.rows;
    const expensesData = expensesByMonth.rows;
    const occupancyData = occupancyByMonth.rows;

    const totalSales = Number(totals.rows[0]?.total_sales || 0);
    const totalExpenses = Number(totals.rows[0]?.total_expenses || 0);

    const months = [...new Set([...salesData.map((r) => r.month), ...expensesData.map((r) => r.month), ...occupancyData.map((r) => r.month)])].sort();

    const salesByMonthMap = Object.fromEntries(salesData.map((r) => [r.month, Number(r.total)]));
    const expensesByMonthMap = Object.fromEntries(expensesData.map((r) => [r.month, Number(r.total)]));

    const occupancyPctByMonth = occupancyData.map((r) => ({
      month: r.month,
      noches_totales: Number(r.noches_totales || 0),
      noches_posibles: cabinsTotal * 30,
      ocupacion_pct: cabinsTotal > 0 ? Math.round((Number(r.noches_totales || 0) / (cabinsTotal * 30)) * 100) : 0
    }));

    const alerts = [];

    if (months.length >= 2) {
      const lastMonth = months[months.length - 1];
      const prevMonth = months[months.length - 2];
      const salesLast = salesByMonthMap[lastMonth] || 0;
      const salesPrev = salesByMonthMap[prevMonth] || 0;
      const expLast = expensesByMonthMap[lastMonth] || 0;

      if (salesLast > 0 && salesPrev > 0 && salesLast < salesPrev * 0.7) {
        alerts.push({
          type: "warning",
          code: "sales_drop",
          title: "Caída de ventas",
          message: `Ventas del último mes (${lastMonth}) bajaron ~${Math.round(((salesPrev - salesLast) / salesPrev) * 100)}% vs mes anterior.`
        });
      }

      if (expLast > salesLast && salesLast > 0) {
        alerts.push({
          type: "danger",
          code: "expenses_over_sales",
          title: "Gastos superan ventas",
          message: `En ${lastMonth} los gastos (${expLast.toLocaleString("es-CL")}) superan las ventas (${salesLast.toLocaleString("es-CL")}). Revisar flujo de caja.`
        });
      }

      const occLast = occupancyPctByMonth.find((o) => o.month === lastMonth);
      if (occLast && occLast.ocupacion_pct < 30) {
        alerts.push({
          type: "warning",
          code: "low_occupancy",
          title: "Período de baja ocupación",
          message: `Ocupación en ${lastMonth}: ${occLast.ocupacion_pct}%. Cabaña(s) desocupada(s). Considera promociones o descuentos de última hora para aumentar reservas.`
        });
      }

      if (occLast && occLast.ocupacion_pct > 85) {
        alerts.push({
          type: "info",
          code: "high_occupancy",
          title: "Alta demanda",
          message: `Ocupación en ${lastMonth}: ${occLast.ocupacion_pct}%. Buen momento para revisar precios o ampliar disponibilidad.`
        });
      }
    }

    if (totalExpenses > totalSales && totalSales > 0) {
      alerts.push({
        type: "danger",
        code: "negative_margin",
        title: "Margen negativo",
        message: `En el período seleccionado los gastos superan las ventas. Revisar estructura de costos.`
      });
    }

    // Tareas post-reserva (utilidades/limpieza) para salidas proximas
    for (const r of upcomingTurnover.rows || []) {
      const nights =
        r.check_in && r.check_out
          ? Math.round((r.check_out.getTime() - r.check_in.getTime()) / (24 * 60 * 60 * 1000))
          : null;
      const nightsLabel = nights && nights > 0 ? `${nights} noche${nights !== 1 ? "s" : ""}` : "estadia";
      alerts.push({
        type: "info",
        code: "turnover_task",
        title: `Tareas post-reserva · salida ${r.check_out.toISOString().slice(0, 10)}`,
        message: `Reserva #${r.id} · ${r.guest_name} en ${r.cabin_name || "cabaña"} (${nightsLabel}). Revisa limpieza, gas, agua, luz e insumos antes del próximo check-in.`
      });
    }

    res.json({
      months,
      salesByMonth: months.map((m) => ({ month: m, total: salesByMonthMap[m] || 0 })),
      expensesByMonth: months.map((m) => ({ month: m, total: expensesByMonthMap[m] || 0 })),
      occupancyByMonth: occupancyPctByMonth,
      totals: { sales: totalSales, expenses: totalExpenses, profit: totalSales - totalExpenses },
      cabinsTotal,
      alerts
    });
  } catch (error) {
    next(error);
  }
});

export default router;
