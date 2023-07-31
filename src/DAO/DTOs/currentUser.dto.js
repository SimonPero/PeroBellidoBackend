export default class CurrentUserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.age = user.age;
    }
}