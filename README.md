# multiselect
JQuery class to transform a HTML select element into an expandable list of checkboxes, thereby allowing for the selection of multiple elements in a dropdown format.

## Basic Usage
    new MultiSelect($('#my-selector > select')); 

## Setting options
You can feed multiple preferences for how you want the selector to appear; namely:

  1. ignore_first_option - tells the class to not include the first option in the selector. Defaults to true (useful where your selector has a default null/zero option at the start). 
  2. n_selected_singular - the text description for the type of <noun> being selected (e.g. 'Author'). Defaults to 'item'.
  3. n_selected_plural - the text description for multiple of the type of <noun> being selected (e.g. 'Authors'). Defaults to n_selected_singular + 's'.
  4. use_styled_checkboxes - replaces default browser checkbox inputs with sytle-able CSS inputs. Defaults to false. When true, the supplied CSS implements Font-Awesome, so amend as necessary. 
  5. checkbox_css_class - applies a custom CSS class to either default browser inputs, or CSS inputs, for additional styling hooks.
  6. label_class - applies a custom CSS class to the label element containing the inputs, for additional styling hooks.
     
    my_selector = new MultiSelect($('#my-selector > select'), {n_selected_singular:'Author'});

## Callbacks
You can provide a callback function as a final argument:

    let debounced_multi_sel_changed = helper.debounce(fetch_resources, 1000);
    my_selector = new MultiSelect($('#my-selector > select'), {n_selected_singular:'Author'}, debounced_multi_sel_changed);   
