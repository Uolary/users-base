document.addEventListener('DOMContentLoaded', function() {
    function GetUsers() {
        fetch('/api/users')
            .then((data) => {
                console.log(data)
                data.json();
            })
            .then((users) => {
                console.log(users)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function CreateUser(userName, userAge) {
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName,
                age: userAge
            })
        }).then((user) => {
            document.querySelector('table tbody').insertAdjacentHTML('beforeend', row(user));
        })
    };

    function row(user) {
        return "<tr data-rowid='" + user._id + "'><td>" + user._id + "</td>" +
                   "<td>" + user.name + "</td> <td>" + user.age + "</td>" +
                   "<td><a class='editLink' data-id='" + user._id + "'>Изменить</a> | " +
                    "<a class='removeLink' data-id='" + user._id + "'>Удалить</a></td></tr>";
    };

    document.querySelector('button[type="submit"]').onclick = function() {
        CreateUser(document.querySelector('input[name="name"]').value, document.querySelector('input[name="age"]').value)
    }

    GetUsers();
});