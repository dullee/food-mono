import { OrderModel } from "../../models/order-model.js";

export const getOrder = async (req, res) =>{
    const order = await OrderModel.find();
    res.status(200).json(order)
}