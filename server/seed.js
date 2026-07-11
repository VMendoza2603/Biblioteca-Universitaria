const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Category = require('./models/Category');
const Book = require('./models/Book');
const Review = require('./models/Review');
const Loan = require('./models/Loan');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Limpiar datos existentes
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Book.deleteMany({}),
      Review.deleteMany({}),
      Loan.deleteMany({}),
    ]);
    console.log('Datos anteriores eliminados');

    // Crear usuarios
    const admin = await User.create({
      name: 'Admin Biblioteca',
      email: 'admin@biblioteca.com',
      password: 'admin123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'Usuario Demo',
      email: 'user@biblioteca.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Usuarios creados:');
    console.log(`  Admin -> admin@biblioteca.com / admin123`);
    console.log(`  User  -> user@biblioteca.com / user123`);

    // Crear categorías
    const categories = await Category.insertMany([
      { name: 'Programación', description: 'Libros de programación y desarrollo de software' },
      { name: 'Bases de Datos', description: 'Sistemas de gestión de bases de datos' },
      { name: 'Matemáticas', description: 'Matemáticas aplicadas y teoría' },
      { name: 'Física', description: 'Física general y aplicada' },
      { name: 'Redes', description: 'Redes de computadoras y comunicaciones' },
      { name: 'Inteligencia Artificial', description: 'IA, machine learning y deep learning' },
      { name: 'Literatura', description: 'Literatura general y técnica' },
    ]);
    console.log(`${categories.length} categorías creadas`);

    // Crear libros
    const booksData = [
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: categories[0]._id, publisher: 'Prentice Hall', year: 2008, quantity: 5, isAvailable: true },
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: categories[0]._id, publisher: 'MIT Press', year: 2009, quantity: 3, isAvailable: true },
      { title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633610', category: categories[0]._id, publisher: 'Addison-Wesley', year: 1994, quantity: 2, isAvailable: true },
      { title: 'MongoDB: The Definitive Guide', author: 'Shannon Bradshaw', isbn: '978-1491954461', category: categories[1]._id, publisher: "O'Reilly", year: 2019, quantity: 4, isAvailable: true },
      { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', category: categories[1]._id, publisher: 'McGraw-Hill', year: 2019, quantity: 2, isAvailable: false },
      { title: 'Cálculo de una Variable', author: 'James Stewart', isbn: '978-6075267198', category: categories[2]._id, publisher: 'Cengage', year: 2017, quantity: 6, isAvailable: true },
      { title: 'Álgebra Lineal', author: 'David C. Lay', isbn: '978-6075267174', category: categories[2]._id, publisher: 'Pearson', year: 2016, quantity: 4, isAvailable: true },
      { title: 'Física Universitaria', author: 'Young & Freedman', isbn: '978-6073243800', category: categories[3]._id, publisher: 'Pearson', year: 2018, quantity: 3, isAvailable: false },
      { title: 'Redes de Computadoras', author: 'Andrew S. Tanenbaum', isbn: '978-6073208786', category: categories[4]._id, publisher: 'Pearson', year: 2012, quantity: 4, isAvailable: true },
      { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isbn: '978-0134610993', category: categories[5]._id, publisher: 'Pearson', year: 2020, quantity: 2, isAvailable: true },
      { title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '978-8437604947', category: categories[6]._id, publisher: 'Cátedra', year: 1967, quantity: 8, isAvailable: true },
      { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '978-8420412146', category: categories[6]._id, publisher: 'Real Academia', year: 1605, quantity: 5, isAvailable: true },
    ];

    const books = await Book.insertMany(booksData);
    console.log(`${books.length} libros creados`);

    // Crear reseñas de ejemplo
    await Review.create([
      { user: user._id, book: books[0]._id, rating: 5, comment: 'Excelente libro, muy recomendado para aprender buenas prácticas' },
      { user: user._id, book: books[1]._id, rating: 4, comment: 'Muy completo, aunque algo denso' },
      { user: admin._id, book: books[0]._id, rating: 5, comment: 'Un clásico de la programación' },
      { user: admin._id, book: books[10]._id, rating: 5, comment: 'Obra maestra de la literatura' },
      { user: user._id, book: books[10]._id, rating: 4, comment: 'Me encantó, una historia fascinante' },
    ]);
    console.log('5 reseñas creadas');

    // Crear préstamo de ejemplo
    await Loan.create({
      user: user._id,
      book: books[3]._id,
      status: 'active',
    });
    // Reducir cantidad del libro prestado
    await Book.findByIdAndUpdate(books[3]._id, { $inc: { quantity: -1 } });
    console.log('1 préstamo activo creado');

    console.log('\n✅ Seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el seed:', error);
    process.exit(1);
  }
};

seed();
