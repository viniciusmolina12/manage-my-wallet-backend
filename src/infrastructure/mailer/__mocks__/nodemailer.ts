const sendMailMock = jest.fn();

const createTransport = jest.fn().mockReturnValue({
   sendMail: sendMailMock,
});

export default {
   createTransport,
   __esModule: true,
   sendMailMock,
};
