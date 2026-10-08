import {
  getDuplicateGroup,
  getDuplicateGroups
} from "../api/duplicateApi";

export const duplicateService = {
  list: getDuplicateGroups,
  getById: getDuplicateGroup
};