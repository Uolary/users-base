document.addEventListener('DOMContentLoaded', function() {
    function GetUsers() {
        fetch('/api/users')
            .then((res) => {
                return res.json();
            })
            .then((users) => {
                for (let user of users) {
                    console.log(user)
                }
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
            console.log('create')
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