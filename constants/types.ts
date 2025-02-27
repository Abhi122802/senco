export interface User {
  id: string; // UUID
  userid: string;
  email: string;
  phoneno: string;
  role: "user" | "admin";
  createdat: string;
}

export interface Sensor {
  id: string;
  userid: string;
  sensor_name: string;
  sensor_value: string;
  createdat: string;
}
