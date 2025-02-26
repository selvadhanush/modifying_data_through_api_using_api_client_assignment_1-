const express = require('express');
const { resolve } = require('path');
const mongoose =require('mongoose');
require('dotenv').config();
const MenuItem = require('./schema.js');

const app = express();
app.use(express.json());

const port=process.env.port

mongoose.connect(process.env.mongo_url)
.then(()=>
  console.log("MongoDB Connected")
).catch(err=>
  console.log(err)
)

app.use(express.static('static'));

app.get('/menu', async (req, res) => {
  try {
      const menuItems = await MenuItem.find();
      res.status(200).json(menuItems);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.post('/menu', async (req, res) => {
  try {
      const { name, description, price } = req.body;
      if (!name || price == null) {
          return res.status(400).json({ error: "Name and price are required." });
      }
      const newItem = new MenuItem({ name, description, price });
      await newItem.save();
      res.status(201).json({ message: "Menu item added successfully", data: newItem });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
