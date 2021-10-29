import react, { Fragment, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import getTokenList from "../utils/getTokenList";

/*
<li key={index}>
                  {token.address}
                  <Image src={token.iconUrl} height="50px" width="50px" />
                </li>
                 */
type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
};

export default () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly MappedToken[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const tokenList = await getTokenList();
        tokenList !== undefined
          ? setOptions([...tokenList])
          : console.log("Trouble in TokenSelectorGetting");
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <Autocomplete
      id="asyncAutocomplete"
      sx={{ width: 300 }}
      disableClearable
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.address === value.address}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      onChange={(e, value) => console.log(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pick an ERC20 token to gift!"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};
