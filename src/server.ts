/* eslint-disable prettier/prettier */
import express from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/jokes');
  console.log('connected')
}

app.get("/", (req: Request, res: Response) => {
  res.send("Application works!");
});

const jokesSchema = new mongoose.Schema({
  jokeId: Number, 
  joke: String,
  category: String
});

const Joke = mongoose.model('Joke', jokesSchema);
module.exports = jokesSchema;

app.get("/jokes", (req: Request, res: Response) => {
  Joke.find().then((data) => res.send(data));
});

app.post("/jokes", async ({ body }: Request, res: Response) => {
  try {
    await Joke.create({
      jokeId: body.id,
      joke: body.joke,
      category: body.category
    })
  } catch (error) {
    throw error;
  }
});

app.delete('/jokes/:id', async (req: Request, res: Response) => {
  await Joke.deleteOne({ jokeId: req.params.id});
  res.send('Joke removed from favorites')
})

app.listen(3004, () => {
  console.log("Application started on port 3004!");
});
