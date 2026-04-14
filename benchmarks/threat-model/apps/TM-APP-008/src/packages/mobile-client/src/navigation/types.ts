export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Projects: undefined;
  ProjectDetail: { id: string };
  Tasks: { projectId?: string } | undefined;
  Settings: undefined;
};

export type RootStackParamList = AuthStackParamList & MainStackParamList;
