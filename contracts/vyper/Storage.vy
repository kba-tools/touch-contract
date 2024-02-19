# @version ^0.3.10

message: String[16]

@external
def store(_message: String[16]):
    self.message = _message

@view
@external
def retrieve() -> String[16]:
    return self.message
