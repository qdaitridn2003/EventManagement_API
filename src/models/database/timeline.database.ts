import mongoose, { Schema } from 'mongoose';

type TimelineSchemaType = {
    _id: Schema.Types.ObjectId;
    event_id: Schema.Types.ObjectId;
    description: string;
    dateTime: Date;
    location: string;
};

const timelineSchema = new Schema<TimelineSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        event_id: { type: Schema.Types.ObjectId, ref: 'event' },
        description: { type: Schema.Types.String },
        dateTime: { type: Schema.Types.Date },
        location: { type: Schema.Types.String },
    },
    {
        timestamps: true,
    },
);

const timelineModel = mongoose.model('timeline', timelineSchema);

export default timelineModel;
