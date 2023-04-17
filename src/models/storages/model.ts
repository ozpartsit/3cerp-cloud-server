import Storage from "./schema";
import Folder, { IFolderModel } from "./folder/schema";
import File, { IFileModel } from "./file/schema";

export default Storage;

interface Types {
    folder: IFolderModel;
    file: IFileModel;
}

export const StorageTypes: Types = {
    folder: Folder,
    file: File
};
