from regex import search

"""
All character requirements for passwords.
Currently:
    1 lowercase letter
    1 uppercase letter
    1 number
    1 symbol
"""
PASSREQS = {
    "lowercase": "[a-z]",
    "uppercase": "[A-Z]",
    "number": "[0-9]",
    "symbol": """[\~\!\@\#\$\%\^\&\*\(\)\_\+\`\-\=\[\]\{\}\|\;\'\:\"\,\.\/\<\>\?\\\]"""
}

PASS_MIN_LEN = 8
PASS_MAX_LEN = 32

def validate_password(password: str):
    passreqs = PASSREQS.copy()

    for req in passreqs:
        passreqs[req] = search(passreqs[req], password) is not None

    passreqs["minlength"] = len(password) >= PASS_MIN_LEN
    passreqs["maxlength"] = len(password) <= PASS_MAX_LEN

    return passreqs