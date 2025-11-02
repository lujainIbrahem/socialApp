import { Request } from "express";
import { availabilityEnum } from "../DB/models/post.model";

export const availability = (req: Request) => [
  { availability: availabilityEnum.public },
  { availability: availabilityEnum.private, userId: req.user?._id },
  {
    availability: availabilityEnum.friends,
    userId: { $in: [...(req.user?.friends || []), req.user?._id] }
  }
];
