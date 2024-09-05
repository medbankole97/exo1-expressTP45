import express from "express";
import bodyParser from "body-parser";
import { Customer, Order, OrderDetail, Product } from "./gestionComande.js";

const app = express();
const port = 3080;
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Bonjour les simploniens");
});

app.post("/app", (req, res) => {
  const customer = new Customer();
  customer.createCustomer({ name: "Fatima", email: "fatima@gmail.com" });

  const p1 = new Product();
  p1.createProduct({ name: "Dress", quantity: 12, price: 200 });

  const p2 = new Product();
  p2.createProduct({ name: "Stylo", quantity: 4, price: 5 });

  const p3 = new Product();
  p3.createProduct({ name: "Mac", quantity: 5, price: 1000 });

  const d1 = new OrderDetail({ quantity: 2, prix: p1.price, product: p1 });
  const d2 = new OrderDetail({ quantity: 1, prix: p2.price, product: p2 });
  const d3 = new OrderDetail({ quantity: 2, prix: p3.price, product: p3 });

  let result = [];

  /** Create order */
  const order = new Order();
  order.createOrder({
    date: new Date(),
    amount: 2405,
    customer: customer.getCustomer(),
    details: [d1, d2, d3],
  });

  result.push(order.getOrder()); // Adding first order in result array

  customer.editCustomer({ name: "Mohamed", email: "med@gmail.com" }); //Update curstomer data

  //Update order data
  order.editOrder({
    date: new Date(),
    amount: 2405,
    customer: customer.getCustomer(),
    details: [d1, d2, d3],
  });

  /***** Association des elements simple */
  const association = {
    customer: customer.getCustomer(),
    p1: p1.getProduct(),
    p2: p2.getProduct(),
  };
  result.push(order.getOrder());

  const items = order.details;
  const p4 = new Product();
  p4.createProduct({ name: "Phone", quantity: 12, price: 200 });
  items.push(new OrderDetail({ quantity: 1, price: p4.price, product: p4 }));

  //Update order data
  order.editOrder({
    date: new Date(),
    amount: 2405,
    customer: customer.getCustomer(),
    details: items,
  });

  let status = 200;
  let message = order;
  if (!order) {
    message = "Not found order";
    status = 400;
  }

  res.status(status).json({ order, result, association });
});

app.listen(port, () => {
  console.log(`L'application est en ecoute sur port ${port}`);
});
