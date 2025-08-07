import { InputNumber } from "antd";
import React from "react";
import { Form } from "antd";
import styles from '../Create1on1Meeting/create1on1meeting.module.css';


interface MeetingMaximumUsersProps {
  value: number;
  setValue: (val: number) => void;
}

function MeetingMaximumUsers({ value, setValue }: MeetingMaximumUsersProps) {
  return (
    <Form.Item
      label="Maximum Users"
      name="maxUsers"
      className={styles.formItem}
      rules={[{ required: true, message: "Please select a user to invite" }]}
    >
      <InputNumber min={1} max={10} value={value} onChange={() => setValue(value)} />
    </Form.Item>
  );
}

export default MeetingMaximumUsers;
