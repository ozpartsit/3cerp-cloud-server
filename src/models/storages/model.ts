import Storage, { IStorageModel } from "./schema";
import Folder, { IFolderModel } from "./folder/schema";
import File, { IFileModel } from "./file/schema";

export default Storage;

interface Types {
    file: IFileModel;
    folder: IFolderModel;
    storage: IStorageModel;
}



export const StorageTypes: Types = {
    file: File,
    folder: Folder,
    storage: Storage
};
