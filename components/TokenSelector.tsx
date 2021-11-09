import React, { Fragment, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import getTokenList from "../utils/getTokenList";
import { Icon } from "@mui/material";

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};

export default (props: {
  options: MappedToken[];
  selectedToken: MappedToken;
  setSelectedToken: React.Dispatch<React.SetStateAction<MappedToken>>;
  tx: string;
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<MappedToken[]>(props.options);
  const [localTokenSelection, setLocalTokenSelection] = useState<MappedToken>({
    address: "",
    name: "",
    iconUrl: "",
    balance: 0,
  });

  useEffect(() => {
    props.setSelectedToken({
      ...props.selectedToken,
      balance: localTokenSelection.balance,
      address: localTokenSelection.address,
      name: localTokenSelection.name,
      iconUrl: localTokenSelection.iconUrl,
    });
  }, [localTokenSelection]);

  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  return (
    <Autocomplete
      key={props.tx}
      id="asyncAutocomplete"
      sx={{
        width: 350,
        height: 50,
        backgroundColor: "#4D00B4",
      }}
      className="rounded-sm"
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
      limitTags={1}
      onChange={(e, value) => setLocalTokenSelection(value)}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Icon>
              <img src={option.iconUrl} width="20px"></img>
            </Icon>{" "}
            <b>{option.name}</b> &#160;|&#160;
            <span className="text-blue-500 text-sm justify-self-end">
              {option.balance}
            </span>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a token..."
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            sx: {
              height: 50,
            },
            className: "text-accentPurple font-bold",
            startAdornment: (
              <Fragment>
                {props.selectedToken !== null ? (
                  <Icon className="flex justify-center items-center">
                    <img src={props.selectedToken.iconUrl} width="20px"></img>
                  </Icon>
                ) : (
                  ""
                )}
              </Fragment>
            ),
            endAdornment: (
              <Fragment>
                <span className="text-accentPurple font-bold text-sm min-w-max">
                  {props.selectedToken.address !== ""
                    ? `Balance: ${props.selectedToken.balance}`
                    : ""}
                </span>
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};
