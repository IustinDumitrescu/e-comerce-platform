import { FormControlLabel, Switch } from "@mui/material";

export default function SwitchField({checked, setChecked, label}) {
    return (
        <FormControlLabel
            control={
                 <Switch
                    checked={checked}
                    onChange={setChecked}
                 />
            }
            label={label}
        />
    );
}