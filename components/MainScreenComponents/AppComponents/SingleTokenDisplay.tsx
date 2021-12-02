import { MappedToken } from "../../../utils/types";
import Image from "next/image";

const SingleTokenDisplay = (token: MappedToken) => {
  return (
    <div>
      {token.name}
      <div className="rounded-full">
        <Image src={token.iconUrl} width={50} height={50} />
      </div>
    </div>
  );
};

export default SingleTokenDisplay;
