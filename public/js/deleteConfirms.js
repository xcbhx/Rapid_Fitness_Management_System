function confirmTrainerDelete(form) {
    const trainerName = form.delete_trainer_name.value;

    return confirm(
        `Are you sure you want to delete ${trainerName}?`
    );
}

function confirmClassDelete(form) {
    const className = form.delete_class_name.value;

    return confirm(
        `Are you sure you want to delete ${className}?`
    );
}