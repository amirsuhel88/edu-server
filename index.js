const connectToDB = require("./dbConnect");
const app = require("./app");
connectToDB().then(() => {
  console.log("Database Connected");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
