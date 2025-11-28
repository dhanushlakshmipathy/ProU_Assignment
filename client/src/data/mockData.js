export const mockEmployees = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        department: "Engineering",
        role: "Senior Developer",
        createdAt: "2023-01-15T09:00:00Z",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
        department: "Design",
        role: "UI/UX Designer",
        createdAt: "2023-02-20T10:30:00Z",
    },
    {
        id: 3,
        name: "Robert Brown",
        email: "robert.brown@example.com",
        phone: "555-123-4567",
        department: "Marketing",
        role: "Marketing Manager",
        createdAt: "2023-03-10T14:15:00Z",
    },
];

export const mockTasks = [
    {
        id: 1,
        title: "Implement Authentication",
        description: "Add JWT based auth to the backend API.",
        status: "TODO",
        dueDate: "2025-12-01",
        employeeId: 1,
    },
    {
        id: 2,
        title: "Design Home Page",
        description: "Create a responsive landing page design.",
        status: "IN_PROGRESS",
        dueDate: "2025-11-30",
        employeeId: 2,
    },
    {
        id: 3,
        title: "Q4 Marketing Plan",
        description: "Draft the marketing strategy for Q4.",
        status: "DONE",
        dueDate: "2025-11-25",
        employeeId: 3,
    },
];
