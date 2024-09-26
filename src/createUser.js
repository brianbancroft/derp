export const usersFetchClient = {
  baseUrl: import.meta.env.MODE === "test" ? "http://127.0.0.1:8080" : "/auth",

  fetch: function (location, args) {
    const fullArguments = args;
    if (localStorage.getItem("bearer-token")) {
      fullArguments.headers = {
        ...fullArguments.headers,
        Authorization: `Bearer ${localStorage.getItem("bearer-token")}`,
      };
    }

    if (["PUT", "PATCH", "POST"].includes(fullArguments.method.toUpperCase())) {
      fullArguments.headers["Content-Type"] =
        fullArguments.headers["Content-Type"] ?? "application/json";
    }
    return window.fetch(location, fullArguments);
  },
};

export const createUser = async (args) => {
  const body = {
    password: {
      email: args.email,
      hash: "string",
      username: args.username,
      userId: args.userId,
    },
  };

  usersFetchClient.POST(`/users`, {
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
