export default class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.isAdmin = user.isAdmin;
        this.role = user.role;
        this.cart = user.cart;
        this.age = user.age;
        this.email=user.email;
        this.documents = user.documents;
        this.last_connection =user.last_connection;
        this._id = user._id;
    }
}