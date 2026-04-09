import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    date_time: {
      type: Date,
      required: true,
    },
    total_tickets: {
      type: Number,
      required: true,
    },
    available_tickets: {
      type: Number,
      default: function (this: any): number {
        return this.total_tickets;
      },
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default mongoose.model("Event", eventSchema);