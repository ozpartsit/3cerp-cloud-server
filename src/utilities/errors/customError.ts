interface CustomError extends Error {
    status: number;
}
class CustomError extends Error {

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = this.constructor.name; // Ustawiamy nazwę błędu na nazwę klasy
    }
}
export default CustomError;