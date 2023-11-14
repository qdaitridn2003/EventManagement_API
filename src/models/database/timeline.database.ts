import mongoose, { Schema } from 'mongoose';
import { TimelineSchemaType } from '../../types';

const timelineSchema = new Schema<TimelineSchemaType>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: Schema.Types.String },
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
