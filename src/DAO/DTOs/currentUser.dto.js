export default class CurrentUserDTO {
    constructor(user) {
        this.firstName = user.firstName ||"noFirstName";
        this.lastName = user.lastName ||"noLastName";
        this.isAdmin = user.isAdmin;
        this.role = user.role;
        this.age = user.age ||"noAge";
    }
}