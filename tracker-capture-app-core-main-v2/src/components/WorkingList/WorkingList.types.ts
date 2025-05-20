//WorkingList.component
export interface IPropData {
  id: number;
  title: string;
  content: string;
}

export interface IPropTypes {
  data: IPropData;
  handleTest(data: IPropData): any;
}

export interface IProgramStatus {
  programStatus: string;
  position: number;
  icon: any;
  show: boolean
}