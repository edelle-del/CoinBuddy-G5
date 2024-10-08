import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import Header from "@/components/Header";
import { colors, radius, spacingY } from "@/constants/theme";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ImageUpload from "@/components/ImageUpload";
import { verticalScale } from "@/utils/styling";
import { createOrUpdateWallet } from "@/services/walletService";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WalletType } from "@/types";

const WalletModal = () => {
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const oldWallet: { name: string; image: string; id?: string } =
    useLocalSearchParams();
  // console.log("params: ", oldWallet);

  useEffect(() => {
    if (oldWallet) {
      setWallet({
        name: oldWallet.name,
        image: oldWallet?.image
          ? oldWallet.image.replace(/__SLASH__/g, "%2F")
          : null,
      });
      // image issue: tried stringify, encodingURIComponent and then decoding it but nothing worked, so i just manually replaced these string... and it worked
    }
  }, []);

  const onSelect = (file: any) => {
    // console.log("file: ", file);
    if (file) setWallet({ ...wallet, image: file });
  };

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    let data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };
    if (oldWallet && oldWallet.id) data.id = oldWallet.id;

    const res = await createOrUpdateWallet(data);
    setLoading(false);
    console.log("res: ", res);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  // console.log("wallet here: ", wallet);

  return (
    <ModalWrapper>
      <Header title={oldWallet ? "Updated Wallet" : "New Wallet"} />

      <View style={styles.container}>
        {/* form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              file={wallet.image}
              onSelect={onSelect}
              onClear={() => setWallet({ ...wallet, image: null })}
              placeholder="Upload Image"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button onPress={onSubmit} loading={loading}>
            <Typo color={colors.black} fontWeight={"700"} size={18}>
              {oldWallet ? "Update Wallet" : "Add Wallet"}
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: spacingY._30,
  },
  footer: {},
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
