#include <iostream>
#include <Windows.h>
#include <Math.h>
#include <string.h>
#include <vector>
#include <string>
#define hiddenMessage cout << " /$$$$$$       /$$        /$$$$$$  /$$    /$$ /$$$$$$$$        /$$$$$$  /$$$$$$$ " << endl;cout << "|_  $$_/      | $$       /$$__  $$| $$   | $$| $$_____/       /$$__  $$| $$__  $$" << endl;cout << "  | $$        | $$      | $$  \\ $$| $$   | $$| $$            | $$  \\ $$| $$  \\ $$" << endl;cout << "  | $$        | $$      | $$  | $$|  $$ / $$/| $$$$$         | $$$$$$$$| $$$$$$$/" << endl;cout << "  | $$        | $$      | $$  | $$ \\  $$ $$/ | $$__/         | $$__  $$| $$____/ " << endl;cout << "  | $$        | $$      | $$  | $$  \\  $$$/  | $$            | $$  | $$| $$      " << endl;cout << " /$$$$$$      | $$$$$$$$|  $$$$$$/   \\  $/   | $$$$$$$$      | $$  | $$| $$      " << endl;cout << "|______/      |________/ \\______/     \\_/    |________/      |__/  |__/|__/      " << endl << endl;

using namespace std;

//struct {
//
//}
//

class Address {
private:
	float x, y;
	int pheromone;
	bool status;
	string name;
public :
	Address(float x = 0, float y = 0, int pheromone = 1, bool status = 0, string name = "ADDRESSNAME") {
		this->x = x;
		this->y = y;
		this->pheromone = pheromone;
		this->status = status;
		this->name = name;
	}

	// PAM
	float getOrdinat() {
		return this->x;
	}
	float getAbsis() {
		return this->y;
	}
	string getName() {
		return this->name;
	}

	void editAttribute(float x, float y, string name) {
		this->x = x;
		this->y = y;
		this->name = name;
	}

	void displayAddress() {
		cout << this->name << " (" << this->x << ", " << this->y << ")" << endl;
	}
};

class Ant {
private:
	int** _traveledAddress;
public:

};

void displayAddress(vector<Address>& address) {
	for (int i = 0; i < address.size(); i++)
	{
		cout << i + 1 << ". "; address[i].displayAddress();
	}
}

void editAddress(vector<Address>& address) {
	cout << "Menu: EDIT ADDRESS\n\n";

	displayAddress(address);
	cout << "\nPlease choose a number = ";
	int number; cin >> number;

	system("CLS");

	cout << "Current ordinat (x) = " << address[number - 1].getOrdinat();
	cout << "\nCurrent absis (y) = " << address[number - 1].getAbsis();
	cout << "\nCurrent address name = " << address[number - 1].getName();

	cout << "\n\nEDIT ADDRESS";
	cout << "\nInput a new ordinat (x) = ";
	float x; cin >> x;
	cout << "Input a new ordinat (y) = ";
	float y; cin >> y;
	cout << "Input a new address name = ";
	cin.ignore();
	string name; getline(cin, name);

	address[number - 1].editAttribute(x, y, name);
}

void addAddress(vector<Address>& address) {
	cout << "Menu: ADD ADDRESS\n\n";

	cout << "Input ordinat (x) = ";
	float x; cin >> x;
	cout << "Input ordinat (y) = ";
	float y; cin >> y;
	cout << "Input address name = ";
	cin.ignore();
	string name; getline(cin, name);

	address.push_back(Address(x, y, 1, false, name));
}

void removeAddress(string nama) {
	
}

float euclideanDistance(float x, float y, float a, float b) {
	return sqrt(pow(x - a, 2) + pow(y - b, 2));
}

void main() {
	vector<Address> address;
	address.push_back(Address(-4, 4, 1, false, "Alfamart"));
	address.push_back(Address(16, -5, 1, false, "Book Store"));
	address.push_back(Address(22, 8, 1, false, "Cat Store"));
	address.push_back(Address(0, -16, 1, false, "Dog Store"));
	address.push_back(Address(3, -19, 1, false, "Elephant Store"));
	address.push_back(Address(24, -20, 1, false, "Fish Store"));
	address.push_back(Address(24, -15, 1, false, "Gramedia"));
	address.push_back(Address(16, -1, 1, false, "H"));
	address.push_back(Address(10, -15, 1, false, "Indomaret"));
	address.push_back(Address(-7, -2, 1, false, ""));
	address.push_back(Address(13, 10, 1, false, ""));
	address.push_back(Address(17, -6, 1, false, ""));
	address.push_back(Address(19, 1, 1, false, ""));
	address.push_back(Address(19, -16, 1, false, ""));
	address.push_back(Address(-8, -8, 1, false, ""));
	address.push_back(Address(-4, -1, 1, false, ""));
	address.push_back(Address(20, -3, 1, false, ""));
	address.push_back(Address(17, -17, 1, false, ""));
	address.push_back(Address(-2, 9, 1, false, ""));
	address.push_back(Address(23, -24, 1, false, ""));
	address.push_back(Address(31, -26, 1, false, ""));
	address.push_back(Address(37, -20, 1, false, ""));
	address.push_back(Address(30, -30, 1, false, ""));
	address.push_back(Address(26, -22, 1, false, ""));
	address.push_back(Address(37, -16, 1, false, ""));
	address.push_back(Address(25, -18, 1, false, ""));
	address.push_back(Address(17, -30, 1, false, ""));
	address.push_back(Address(26, -28, 1, false, ""));
	address.push_back(Address(27, -15, 1, false, ""));
	address.push_back(Address(18, -24, 1, false, ""));

	while (1) {
		system("CLS");

		cout << "Menu:\n";
		cout << "1. Edit Address\n";
		cout << "2. Add Address\n";
		cout << "3. Remove Address\n";
		cout << "4. Display Address\n";
		cout << "0. Exit\n\n";

		hiddenMessage

		cout << "Input menu: ";
		int menu; cin >> menu;

		if (menu == 0) {
			system("CLS");
			break;
		}

		if (menu == 1) {
			system("CLS");

			editAddress(address);

			system("PAUSE");
		}

		if (menu == 2) {
			system("CLS");

			addAddress(address);

			system("PAUSE");
		}

		if (menu == 3) {
			system("CLS");

			//hapusAlamat();

			system("PAUSE");
		}

		if (menu == 4) {
			system("CLS");

			cout << "Menu: DISPLAY ADDRESS\n\n";

			displayAddress(address);

			system("PAUSE");
		}
	}
}