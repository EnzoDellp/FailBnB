jest.mock("express-validator");
const { validationResult } = require("express-validator");
const validate = require("./validate.middleware");
describe("validate middleware", () => {
  test("llama a next() cuando no hay errores", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const next = jest.fn();
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
    validate(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("En este caso hay Errores", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    };
    const next = jest.fn();
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Campo Requerido" }],
    });
    validate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
