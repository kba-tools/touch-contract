#pragma version ^0.4.0

admin: address
struct Certificate:
    name: String[24]
    course: String[18]
    grade: String[1]
    date: String[8]

event Issued:
    course: String[18]
    id: uint256
    date: String[8]

certificates: HashMap[uint256, Certificate]

@deploy
def __init__():
    self.admin = msg.sender

@external
def issue_certificate(_id: uint256, _name: String[24], _course: String[18], _grade: String[1], _date: String[8]):
    assert msg.sender == self.admin, "Access Denied"
    self.certificates[_id] = Certificate({name: _name, course: _course, grade: _grade, date: _date})
    log Issued(_course, _id, _date)

@external
@view
def fetch_certificate(_id: uint256) -> Certificate:
    return self.certificates[_id]
