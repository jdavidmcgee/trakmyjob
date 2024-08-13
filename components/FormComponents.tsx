import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form'; // the control object from react-hook-form, this is the object that we are going to pass to the FormField component, and the FormField component will use this object to register the input field

type CustomFormFieldProps = {
	control: Control<any>;
	name: string;
};

export function CustomFormField({ control, name }: CustomFormFieldProps) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="capitalize">{name}</FormLabel>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

type CustomFormSelectProps = {
	name: string;
	control: Control<any>;
	items: string[];
	labelText?: string;
};

export function CustomFormSelect({
	name,
	control,
	items,
	labelText,
}: CustomFormSelectProps) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				return (
					<FormItem>
						<FormLabel className="capitalize">
							{labelText || name}
						</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{items.map(item => {
									return (
										<SelectItem key={item} value={item}>
											{item}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
