import {Connect} from "@/db/dbConfig";
import Task from "@/models/todoModel";
import {NextRequest, NextResponse} from "next/server";

Connect();

export async function POST(request: NextRequest) {
	try {
		// Parse the request body as JSON
		const reqBody = await request.json();
		console.log(reqBody);
		// Destructure the task property from the request body
		const {task} = reqBody;

		// Check if the task property exists
		if (!task) {
			return NextResponse.json({error: "Task is required."}, {status: 400});
		}

		// Create a new Task instance with the task property
		const userTask = new Task({task});

		// Save the task to the database
		const savedTask = await userTask.save();

		// Return a success response with the saved task
		return NextResponse.json({
			message: "Task added successfully.",
			success: true,
			task: savedTask,
		});
	} catch (error: any) {
		console.error(error);
		// Return a generic server error response
		return NextResponse.json({error: "Internal server error."}, {status: 500});
	}
}
