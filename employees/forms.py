from .models import Employee
from django import forms


class CreateEmployee(forms.ModelForm):
    class Meta:
        model = Employee
        fields = '__all__'

    first_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Primeiro Nome'}), label='Primeiro Nome')

    last_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Último Nome'}),
        label='Último Nome')

    cpf = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Digite apenas os números. Ex: 12345678901.'}), label='CPF')

    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Email'}),
        label='Email')

    phone = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Digite apenas os números. Ex: 5527999887766.'}), label='Telefone')

    emergency_contact = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Digite apenas os números. Ex: 5527999887766.'}), label='Telefone para emergências')

    address = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Endereço completo com complemento.'}), label='Endereço')
