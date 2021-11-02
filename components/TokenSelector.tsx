import react, { Fragment, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import getTokenList from "../utils/getTokenList";
import { Icon } from "@mui/material";

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
};

export default () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly MappedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<MappedToken>({
    address: "",
    name: "",
    iconUrl: "",
  });
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

  useEffect(() => {
    console.log(selectedToken);
  }, [selectedToken]);

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
      limitTags={1}
      onChange={(e, value) => setSelectedToken(value)}
      renderTags={(options, props) => {
        return options.map((option) => (
          <li {...props}>
            <Icon>
              <img src={option.iconUrl} width="20px"></img>
            </Icon>{" "}
            {option.name}
          </li>
        ));
      }}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Icon>
              <img src={option.iconUrl} width="20px"></img>
            </Icon>{" "}
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pick an ERC20 token to gift!"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Fragment>
                {selectedToken !== null ? (
                  <Icon className="flex justify-center items-center">
                    <img src={selectedToken.iconUrl} width="20px"></img>
                  </Icon>
                ) : (
                  ""
                )}
              </Fragment>
            ),
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
