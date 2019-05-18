import { Request, Response } from "express";
import GeneralInfomation from "../models/General";

export const getGeneralInfomation = async (req: Request, res: Response) => {
    const general = (await GeneralInfomation.find({}))[0];
    return res.render("admin/general/general", {
        general: general
    });
};