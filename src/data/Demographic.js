// eslint-disable-next-line import/prefer-default-export

import { NODE } from './CHIGroup';

export const demographics = [
];

const questionTypeList = new Array(100).fill(1);

demographics.forEach((x) => { questionTypeList[NODE.indexOf(`Q${x.id}`)] = 0; });

export const TypeList = questionTypeList;
