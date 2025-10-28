import { Table, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const columns = [
	{
		title: "Id",
		dataIndex: "id",
		key: "id",
	},
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Surname",
		dataIndex: "surname",
		key: "surname",
	},
];

function TeachersPage() {
	const [teachers, setTeachers] = useState([]);

	async function getTeachers() {
		const rec = await axios.get(
			"https://037771c025a6e640.mokky.dev/teachers"
		);
		setTeachers(rec.data);
	}
	useEffect(() => {
		getTeachers();
	}, []);

	return (
		<div>
			<div>
				<h2>teachers</h2>
				<Button>Add</Button>
			</div>
			<Table dataSource={teachers} columns={columns} />
		</div>
	);
}
export default TeachersPage;
