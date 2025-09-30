import { ApplicationMenu } from "../../application-menu";
import { MenuFunctionModel } from "../menu-function/menu-function";

export interface RoleFunctionModel {
  id?:string,
  menuFunctionId:string;
  roleId:string;
  status:boolean;
  items?: ApplicationMenu;
  menuFunctions?:MenuFunctionModel;
}
