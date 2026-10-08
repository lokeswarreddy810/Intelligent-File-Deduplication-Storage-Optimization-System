import {
  deleteFile,
  getDeletionHistory,
  getDeletionImpact
} from "../api/deletionApi";

export const deletionService = {
  getImpact: getDeletionImpact,
  delete: deleteFile,
  getHistory: getDeletionHistory
};