import react from "react";

const MainScreen = () => {
  return (
    <div className="w-60 h-96 rounded-md border border-red-500">
      Wallet Connected
    </div>
  );
};

export default MainScreen;

// Useful

const tokensQuery = `{
  registries{
    id
    tokens(where: {status_in:[Registered]}) {
      name
      ticker
      address
      symbolMultihash
      status
    }
  }
}
`;
