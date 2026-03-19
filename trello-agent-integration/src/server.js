import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT || 3400);

app.listen(port, () => {
  console.log(`trello-agent-integration escuchando en puerto ${port}`);
});
