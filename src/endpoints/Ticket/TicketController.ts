import {Request, Response } from "express";
import TicketModel from "./TicketModel";
import { Document } from "mongoose"

const create = (req: Request, res: Response) => {
    TicketModel.create(req.body)
        .then((data) => {
            return res.status(201).json(data);})
        .catch((err) => {
            return res.status(500).json({message: err.message});
        });
}

const get = (req:Request, res:Response) => {
    TicketModel.findById(req.params.id).then((data) => {
        return res.status(200).json(data);
    }).catch((err) => {
        return res.status(500).json({message: err.message});
    })
}

const deleteById = (req:Request, res:Response) => {
    TicketModel.findByIdAndDelete(req.params.id).then((data) => {
        return res.status(200).json(data);
    }).catch((err) => {
        return res.status(500).json({message: err.message});
    });
}

const validate = (req: Request, res: Response) => {
    TicketModel.findOne({ uuid: req.params.uuid }).then((ticket) => {
        if (!ticket) {
          return res.status(404).json({ success: false, message: "Ticket nicht gefunden." });
        }
        if (ticket.isUsed) {
          return res.status(409).json({ success: false, message: "Ticket ist bereits verwendet.", usage: ticket.validatedAt });
        }
        ticket.isUsed = true;
        ticket.validatedAt = new Date().toLocaleString();
        ticket.save()
          .then(() => {
            return res.status(200).json({ success: true, message: "Ticket validiert.", usage: ticket.validatedAt });
          })
          .catch((err) => {
            return res.status(500).json({ success: false, message: err.message });
          });
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err.message });
      });
  };

export default { create, get, deleteById, validate };