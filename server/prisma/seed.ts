import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@edu.com' },
        update: {},
        create: {
            email: 'admin@edu.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            department: 'Administration',
            status: 'ACTIVE',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create Department
    const csDepartment = await prisma.department.upsert({
        where: { code: 'CS' },
        update: {},
        create: {
            name: 'Computer Science',
            code: 'CS',
            headOfDepartment: 'Dr. Sarah Wilson',
            description: 'Department of Computer Science and Engineering',
        },
    });
    console.log('✅ Created department:', csDepartment.name);

    // Create Course
    const course = await prisma.course.upsert({
        where: { code: 'CSE-CS-S3' },
        update: {},
        create: {
            name: 'CSE - Core Computer Science',
            code: 'CSE-CS-S3',
            semester: 3,
            weeks: 18,
            departmentId: csDepartment.id,
            credits: 24,
            description: 'Core Computer Science program for 3rd semester',
        },
    });
    console.log('✅ Created course:', course.name);

    // Create Lecturer User
    const lecturerUser = await prisma.user.upsert({
        where: { email: 'lecturer@edu.com' },
        update: {},
        create: {
            email: 'lecturer@edu.com',
            password: hashedPassword,
            firstName: 'Dr. Sarah',
            lastName: 'Wilson',
            role: 'LECTURER',
            department: 'Computer Science',
            status: 'ACTIVE',
        },
    });
    console.log('✅ Created lecturer user:', lecturerUser.email);

    // Create Lecturer Profile
    const lecturer = await prisma.lecturer.upsert({
        where: { userId: lecturerUser.id },
        update: {},
        create: {
            userId: lecturerUser.id,
            employeeId: 'L001',
            specialization: 'Data Structures & Algorithms',
            departmentId: csDepartment.id,
        },
    });
    console.log('✅ Created lecturer profile');

    // Create Subjects
    const dataStructures = await prisma.subject.upsert({
        where: { code: 'CS301' },
        update: {},
        create: {
            code: 'CS301',
            name: 'Data Structures & Algorithms',
            courseId: course.id,
            lecturerId: lecturer.id,
            weeklyHours: 4,
            totalHours: 72,
            semester: 3,
            roomNumber: 'A-301',
        },
    });
    console.log('✅ Created subject:', dataStructures.name);

    const webDev = await prisma.subject.upsert({
        where: { code: 'CS304' },
        update: {},
        create: {
            code: 'CS304',
            name: 'Web Development',
            courseId: course.id,
            lecturerId: lecturer.id,
            weeklyHours: 3,
            totalHours: 54,
            semester: 3,
            roomNumber: 'A-304',
        },
    });
    console.log('✅ Created subject:', webDev.name);

    // Create Student User
    const studentUser = await prisma.user.upsert({
        where: { email: 'student@edu.com' },
        update: {},
        create: {
            email: 'student@edu.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: 'STUDENT',
            department: 'Computer Science',
            status: 'ACTIVE',
        },
    });
    console.log('✅ Created student user:', studentUser.email);

    // Create Student Profile
    const student = await prisma.student.upsert({
        where: { userId: studentUser.id },
        update: {},
        create: {
            userId: studentUser.id,
            studentId: 'S001',
            enrollmentDate: new Date('2023-09-01'),
            currentSemester: 3,
            courseId: course.id,
            gpa: 3.8,
            targetAttendance: 75,
        },
    });
    console.log('✅ Created student profile');

    // Create Enrollments
    const enrollment1 = await prisma.enrollment.create({
        data: {
            studentId: student.id,
            subjectId: dataStructures.id,
            enrollmentDate: new Date('2023-09-01'),
            status: 'ACTIVE',
        },
    });
    console.log('✅ Enrolled student in:', dataStructures.name);

    await prisma.enrollment.create({
        data: {
            studentId: student.id,
            subjectId: webDev.id,
            enrollmentDate: new Date('2023-09-01'),
            status: 'ACTIVE',
        },
    });
    console.log('✅ Enrolled student in:', webDev.name);

    // Create some attendance records
    const today = new Date();
    for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        await prisma.attendance.create({
            data: {
                enrollmentId: enrollment1.id,
                subjectId: dataStructures.id,
                studentId: student.id,
                date,
                status: i % 4 === 0 ? 'ABSENT' : 'PRESENT',
                markedBy: lecturerUser.id,
            },
        });
    }
    console.log('✅ Created attendance records');

    // Create an assignment
    await prisma.assignment.create({
        data: {
            title: 'Algorithm Analysis Report',
            description: 'Analyze sorting algorithms and compare their performance',
            subjectId: dataStructures.id,
            createdBy: lecturerUser.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            totalMarks: 100,
            attachments: [],
            status: 'PUBLISHED',
        },
    });
    console.log('✅ Created assignment');

    // Create timetable slots
    await prisma.timetableSlot.create({
        data: {
            subjectId: dataStructures.id,
            dayOfWeek: 'MONDAY',
            startTime: '09:00',
            endTime: '11:00',
            roomNumber: 'A-301',
            slotType: 'LECTURE',
            isRecurring: true,
        },
    });

    await prisma.timetableSlot.create({
        data: {
            subjectId: webDev.id,
            dayOfWeek: 'WEDNESDAY',
            startTime: '14:00',
            endTime: '17:00',
            roomNumber: 'Lab-2',
            slotType: 'LAB',
            isRecurring: true,
        },
    });
    console.log('✅ Created timetable slots');

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📝 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━');
    console.log('Student:  student@edu.com  / password');
    console.log('Lecturer: lecturer@edu.com / password');
    console.log('Admin:    admin@edu.com    / password');
    console.log('━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
