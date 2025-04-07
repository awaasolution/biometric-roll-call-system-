import { create } from "zustand";

type loggedUserDataType = {
  loggedUserId: string;
  loggedUserName: string;
  loggedUserRole: string;
  loggedUserRollNumber: string;
  loggedUserProfileImg: string;
  loggedUserToken: string;
  loggedUserYear: string;
  loggedUserAttendanceMarked: number;
  loggedUserAppliedFaceReko: number;
  loggedUserPhoneNumber: string;
  loggedUserEmail: string;
};

type loggedUserStoreDatType = {
  loggedUserData: loggedUserDataType;
  setLoggedUserData: (data: loggedUserDataType) => void;
  setLoggedUserId: (id: string) => void;
  setLoggedUserName: (name: string) => void;
  setLoggedUserRole: (role: string) => void;
  setLoggedUserRollNumber: (rollNumber: string) => void;
  setLoggedUserProfileImg: (profileImg: string) => void;
  setLoggedUserToken: (token: string) => void;
  setLoggedUserYear: (year: string) => void;
  setAttendanceMarked: (data: number) => void;
  setLoggedUserAppliedFacedReko: (data: number) => void;
  setLoggedUserPhoneNumber: (phoneNumber: string) => void;
  setLoggedUserEmail: (email: string) => void;
};

const loggedUserStore = create<loggedUserStoreDatType>((set) => ({
  loggedUserData: {
    loggedUserId: "",
    loggedUserName: "",
    loggedUserRole: "",
    loggedUserRollNumber: "",
    loggedUserProfileImg: "",
    loggedUserToken: "",
    loggedUserYear: "",
    loggedUserAttendanceMarked: 0,
    loggedUserAppliedFaceReko: 0,
    loggedUserPhoneNumber: "",
    loggedUserEmail: "",
  },
  setLoggedUserData: (data) => {
    set(() => ({
      loggedUserData: data,
    }));
  },
  setLoggedUserId: (id) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserId: id,
      },
    }));
  },
  setLoggedUserName: (name) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserName: name,
      },
    }));
  },
  setLoggedUserRole: (role) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserRole: role,
      },
    }));
  },
  setLoggedUserRollNumber: (rollNumber) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserRollNumber: rollNumber,
      },
    }));
  },
  setLoggedUserProfileImg: (profileImg) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserProfileImg: profileImg,
      },
    }));
  },
  setLoggedUserToken: (token) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserToken: token,
      },
    }));
  },
  setLoggedUserYear: (year) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserYear: year,
      },
    }));
  },
  setAttendanceMarked: (data) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserAttendanceMarked: data,
      },
    }));
  },
  setLoggedUserAppliedFacedReko: (data) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserAppliedFaceReko: data,
      },
    }));
  },
  setLoggedUserPhoneNumber: (phoneNumber) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserPhoneNumber: phoneNumber,
      },
    }));
  },
  setLoggedUserEmail: (email) => {
    set((state) => ({
      loggedUserData: {
        ...state.loggedUserData,
        loggedUserEmail: email,
      },
    }));
  },
}));

export default loggedUserStore;
