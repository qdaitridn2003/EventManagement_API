import { UploadType } from '../../constants';

export const uploadTypeHelper = (type: number) => {
    switch (type) {
        case UploadType.Avatar:
            return 'avatars';
        case UploadType.Attachment:
            return 'attachments';
        case UploadType.Event:
            return 'events';
        case UploadType.Item:
            return 'items';
        case UploadType.Transport:
            return 'transports';
        default:
            return '';
    }
};
